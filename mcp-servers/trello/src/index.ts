#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const TRELLO_BOARD_ID = process.env.TRELLO_BOARD_ID;
const TRELLO_LIST_NAME = process.env.TRELLO_LIST_NAME || 'Today Dashboard';

if (!TRELLO_API_KEY || !TRELLO_TOKEN) {
  console.error('Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in environment variables or .env file');
  process.exit(1);
}

const TRELLO_BASE_URL = 'https://api.trello.com/1';

interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  idList: string;
  url: string;
  labels: Array<{ id: string; name: string; color: string }>;
  due: string | null;
  idBoard: string;
}

interface TrelloList {
  id: string;
  name: string;
  idBoard: string;
}

interface TrelloBoard {
  id: string;
  name: string;
}

class TrelloMCPServer {
  private server: Server;
  private axiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: 'trello-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: TRELLO_BASE_URL,
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
      },
    });

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_copilot_cards',
          description: 'Retrieve all cards marked as COPILOT from the specified Trello board/list. Cards are filtered by label or name containing "COPILOT".',
          inputSchema: {
            type: 'object',
            properties: {
              board_id: {
                type: 'string',
                description: 'Trello Board ID (optional, uses env variable if not provided)',
              },
              list_name: {
                type: 'string',
                description: 'Name of the list to filter cards from (optional, defaults to "Today Dashboard")',
              },
            },
          },
        },
        {
          name: 'get_card_details',
          description: 'Get detailed information about a specific Trello card including description, comments, and checklists.',
          inputSchema: {
            type: 'object',
            properties: {
              card_id: {
                type: 'string',
                description: 'The ID of the Trello card',
              },
            },
            required: ['card_id'],
          },
        },
        {
          name: 'list_boards',
          description: 'List all available Trello boards for the authenticated user.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'list_board_lists',
          description: 'List all lists in a specific Trello board.',
          inputSchema: {
            type: 'object',
            properties: {
              board_id: {
                type: 'string',
                description: 'Trello Board ID (optional, uses env variable if not provided)',
              },
            },
          },
        },
        {
          name: 'update_card_status',
          description: 'Update a card by adding a comment about task completion status.',
          inputSchema: {
            type: 'object',
            properties: {
              card_id: {
                type: 'string',
                description: 'The ID of the Trello card',
              },
              comment: {
                type: 'string',
                description: 'Comment to add to the card',
              },
            },
            required: ['card_id', 'comment'],
          },
        },
        {
          name: 'get_card_labels',
          description: 'Get all labels attached to a specific Trello card.',
          inputSchema: {
            type: 'object',
            properties: {
              card_id: {
                type: 'string',
                description: 'The ID of the Trello card',
              },
            },
            required: ['card_id'],
          },
        },
        {
          name: 'get_board_labels',
          description: 'Get all available labels for a specific Trello board.',
          inputSchema: {
            type: 'object',
            properties: {
              board_id: {
                type: 'string',
                description: 'Trello Board ID (optional, uses env variable if not provided)',
              },
            },
          },
        },
        {
          name: 'add_label_to_card',
          description: 'Add a label to a Trello card. You can specify either an existing label ID or create a new label with a name and color.',
          inputSchema: {
            type: 'object',
            properties: {
              card_id: {
                type: 'string',
                description: 'The ID of the Trello card',
              },
              label_id: {
                type: 'string',
                description: 'The ID of an existing label to add (optional if label_name is provided)',
              },
              label_name: {
                type: 'string',
                description: 'Name of the label to add or create (optional if label_id is provided)',
              },
              color: {
                type: 'string',
                description: 'Color for the label if creating new one. Options: yellow, purple, blue, red, green, orange, black, sky, pink, lime, null',
              },
            },
            required: ['card_id'],
          },
        },
        {
          name: 'remove_label_from_card',
          description: 'Remove a label from a Trello card.',
          inputSchema: {
            type: 'object',
            properties: {
              card_id: {
                type: 'string',
                description: 'The ID of the Trello card',
              },
              label_id: {
                type: 'string',
                description: 'The ID of the label to remove',
              },
            },
            required: ['card_id', 'label_id'],
          },
        },
      ] as Tool[],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'get_copilot_cards':
            return await this.getCopilotCards(args);
          case 'get_card_details':
            return await this.getCardDetails(args);
          case 'list_boards':
            return await this.listBoards();
          case 'list_board_lists':
            return await this.listBoardLists(args);
          case 'update_card_status':
            return await this.updateCardStatus(args);
          case 'get_card_labels':
            return await this.getCardLabels(args);
          case 'get_board_labels':
            return await this.getBoardLabels(args);
          case 'add_label_to_card':
            return await this.addLabelToCard(args);
          case 'remove_label_from_card':
            return await this.removeLabelFromCard(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async getCopilotCards(args: any) {
    const boardId = args.board_id || TRELLO_BOARD_ID;
    const listNameFilter = args.list_name || TRELLO_LIST_NAME;

    if (!boardId) {
      throw new Error('Board ID must be provided or set in TRELLO_BOARD_ID environment variable');
    }

    // Get all lists in the board
    const listsResponse = await this.axiosInstance.get(`/boards/${boardId}/lists`);
    const lists: TrelloList[] = listsResponse.data;

    // Filter to the specific list if provided
    let targetLists = lists;
    if (listNameFilter) {
      targetLists = lists.filter(list => 
        list.name.toLowerCase().includes(listNameFilter.toLowerCase())
      );
    }

    if (targetLists.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No lists found matching "${listNameFilter}" in the board.`,
          },
        ],
      };
    }

    // Get cards from all target lists
    const allCards: TrelloCard[] = [];
    for (const list of targetLists) {
      const cardsResponse = await this.axiosInstance.get(`/lists/${list.id}/cards`);
      allCards.push(...cardsResponse.data);
    }

    // Filter cards that have COPILOT in name or labels
    const copilotCards = allCards.filter(card => {
      const hasLabelCopilot = card.labels.some(label => 
        label.name.toUpperCase().includes('COPILOT')
      );
      const hasNameCopilot = card.name.toUpperCase().includes('COPILOT');
      return hasLabelCopilot || hasNameCopilot;
    });

    if (copilotCards.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No cards marked as COPILOT found in the specified list(s).',
          },
        ],
      };
    }

    const cardsSummary = copilotCards.map(card => ({
      id: card.id,
      name: card.name,
      description: card.desc,
      url: card.url,
      labels: card.labels.map(l => l.name),
      due: card.due,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(cardsSummary, null, 2),
        },
      ],
    };
  }

  private async getCardDetails(args: any) {
    const { card_id } = args;

    if (!card_id) {
      throw new Error('card_id is required');
    }

    // Get card details
    const cardResponse = await this.axiosInstance.get(`/cards/${card_id}`, {
      params: { fields: 'all' },
    });
    const card: TrelloCard = cardResponse.data;

    // Get card comments
    const commentsResponse = await this.axiosInstance.get(`/cards/${card_id}/actions`, {
      params: { filter: 'commentCard' },
    });
    const comments = commentsResponse.data;

    // Get card checklists
    const checklistsResponse = await this.axiosInstance.get(`/cards/${card_id}/checklists`);
    const checklists = checklistsResponse.data;

    const details = {
      id: card.id,
      name: card.name,
      description: card.desc,
      url: card.url,
      labels: card.labels.map(l => l.name),
      due: card.due,
      comments: comments.map((c: any) => ({
        date: c.date,
        text: c.data.text,
        memberCreator: c.memberCreator.fullName,
      })),
      checklists: checklists.map((cl: any) => ({
        name: cl.name,
        items: cl.checkItems.map((item: any) => ({
          name: item.name,
          state: item.state,
        })),
      })),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(details, null, 2),
        },
      ],
    };
  }

  private async listBoards() {
    const response = await this.axiosInstance.get('/members/me/boards');
    const boards: TrelloBoard[] = response.data;

    const boardsList = boards.map(board => ({
      id: board.id,
      name: board.name,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(boardsList, null, 2),
        },
      ],
    };
  }

  private async listBoardLists(args: any) {
    const boardId = args.board_id || TRELLO_BOARD_ID;

    if (!boardId) {
      throw new Error('Board ID must be provided or set in TRELLO_BOARD_ID environment variable');
    }

    const response = await this.axiosInstance.get(`/boards/${boardId}/lists`);
    const lists: TrelloList[] = response.data;

    const listsSummary = lists.map(list => ({
      id: list.id,
      name: list.name,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(listsSummary, null, 2),
        },
      ],
    };
  }

  private async updateCardStatus(args: any) {
    const { card_id, comment } = args;

    if (!card_id || !comment) {
      throw new Error('card_id and comment are required');
    }

    await this.axiosInstance.post(`/cards/${card_id}/actions/comments`, null, {
      params: { text: comment },
    });

    return {
      content: [
        {
          type: 'text',
          text: `Comment added to card ${card_id}: "${comment}"`,
        },
      ],
    };
  }

  private async getCardLabels(args: any) {
    const { card_id } = args;

    if (!card_id) {
      throw new Error('card_id is required');
    }

    const response = await this.axiosInstance.get(`/cards/${card_id}/labels`);
    const labels = response.data;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(labels, null, 2),
        },
      ],
    };
  }

  private async getBoardLabels(args: any) {
    const boardId = args.board_id || TRELLO_BOARD_ID;

    if (!boardId) {
      throw new Error('Board ID must be provided or set in TRELLO_BOARD_ID environment variable');
    }

    const response = await this.axiosInstance.get(`/boards/${boardId}/labels`);
    const labels = response.data;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(labels, null, 2),
        },
      ],
    };
  }

  private async addLabelToCard(args: any) {
    const { card_id, label_id, label_name, color } = args;

    if (!card_id) {
      throw new Error('card_id is required');
    }

    // If label_id is provided, use it directly
    if (label_id) {
      await this.axiosInstance.post(`/cards/${card_id}/idLabels`, null, {
        params: { value: label_id },
      });

      return {
        content: [
          {
            type: 'text',
            text: `Label ${label_id} added to card ${card_id}`,
          },
        ],
      };
    }

    // Otherwise, find or create label by name
    if (!label_name) {
      throw new Error('Either label_id or label_name must be provided');
    }

    // Get the card to find its board
    const cardResponse = await this.axiosInstance.get(`/cards/${card_id}`);
    const boardId = cardResponse.data.idBoard;

    // Get all board labels
    const labelsResponse = await this.axiosInstance.get(`/boards/${boardId}/labels`);
    const boardLabels = labelsResponse.data;

    // Try to find existing label with matching name
    let targetLabel = boardLabels.find((l: any) => 
      l.name.toLowerCase() === label_name.toLowerCase()
    );

    // If label doesn't exist, create it
    if (!targetLabel) {
      const createResponse = await this.axiosInstance.post(`/boards/${boardId}/labels`, null, {
        params: {
          name: label_name,
          color: color || 'blue',
        },
      });
      targetLabel = createResponse.data;
    }

    // Add label to card
    await this.axiosInstance.post(`/cards/${card_id}/idLabels`, null, {
      params: { value: targetLabel.id },
    });

    return {
      content: [
        {
          type: 'text',
          text: `Label "${label_name}" (${targetLabel.id}) added to card ${card_id}`,
        },
      ],
    };
  }

  private async removeLabelFromCard(args: any) {
    const { card_id, label_id } = args;

    if (!card_id || !label_id) {
      throw new Error('card_id and label_id are required');
    }

    await this.axiosInstance.delete(`/cards/${card_id}/idLabels/${label_id}`);

    return {
      content: [
        {
          type: 'text',
          text: `Label ${label_id} removed from card ${card_id}`,
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Trello MCP Server running on stdio');
  }
}

const server = new TrelloMCPServer();
server.run().catch(console.error);
