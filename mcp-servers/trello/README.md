# Trello MCP Server

A Model Context Protocol (MCP) server for integrating Trello with GitHub Copilot. This server enables you to retrieve and manage Trello cards marked as COPILOT directly from your development environment.

## Features

- **Retrieve COPILOT Cards**: Get all cards marked with "COPILOT" label or containing "COPILOT" in the name
- **Filter by Board/List**: Target specific boards and lists (e.g., "Today Dashboard")
- **Card Details**: View complete card information including descriptions, comments, and checklists
- **Status Updates**: Add comments to cards to track implementation progress
- **Board Management**: List available boards and their lists

## Setup

### 1. Get Trello API Credentials

1. **Get your API Key**:
   - Visit https://trello.com/app-key
   - Copy your API Key

2. **Get your Token**:
   - On the same page, click the "Token" link or visit:
     ```
     https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&key=YOUR_API_KEY
     ```
   - Replace `YOUR_API_KEY` with your actual API key
   - Authorize the application
   - Copy the token

3. **Get your Board ID**:
   - Open your Trello board in a browser
   - Add `.json` to the end of the URL (e.g., `https://trello.com/b/ABC123.json`)
   - Look for the `id` field in the JSON response
   - Alternatively, use the `list_boards` tool after setting up the server

### 2. Configure Environment Variables

1. Navigate to the trello server directory:
   ```powershell
   cd D:\Oracle\oracledev\mcp-servers\trello
   ```

2. Copy the example environment file:
   ```powershell
   cp .env.example .env
   ```

3. Edit `.env` and add your credentials:
   ```env
   TRELLO_API_KEY=your_api_key_here
   TRELLO_TOKEN=your_token_here
   TRELLO_BOARD_ID=your_board_id_here
   TRELLO_LIST_NAME=Today Dashboard
   ```

### 3. Install Dependencies and Build

```powershell
cd D:\Oracle\oracledev\mcp-servers\trello
npm install
npm run build
```

### 4. Configure MCP Settings

The server is already configured in `.vscode/mcp.json`. Make sure to set your environment variables:

- `TRELLO_API_KEY`: Your Trello API key
- `TRELLO_TOKEN`: Your Trello token
- `TRELLO_BOARD_ID`: Your board ID
- `TRELLO_LIST_NAME`: (Optional) Defaults to "Today Dashboard"

You can set these as system environment variables or they will be read from the `.env` file.

### 5. Restart VS Code

After configuration, restart VS Code to load the new MCP server.

## Available Tools

### `get_copilot_cards`
Retrieve all cards marked as COPILOT from your Trello board.

**Parameters:**
- `board_id` (optional): Trello Board ID (uses env variable if not provided)
- `list_name` (optional): Name of the list to filter (defaults to "Today Dashboard")

**Example usage:**
```
Get all COPILOT cards from Today Dashboard
```

### `get_card_details`
Get detailed information about a specific card.

**Parameters:**
- `card_id` (required): The ID of the Trello card

**Example usage:**
```
Show me the details of card 5f8b3c2a1d4e6f7g8h9i0j1k
```

### `list_boards`
List all available Trello boards for the authenticated user.

**Example usage:**
```
What Trello boards do I have access to?
```

### `list_board_lists`
List all lists in a specific board.

**Parameters:**
- `board_id` (optional): Trello Board ID (uses env variable if not provided)

**Example usage:**
```
Show me all lists in my Trello board
```

### `update_card_status`
Add a comment to a card to track implementation progress.

**Parameters:**
- `card_id` (required): The ID of the Trello card
- `comment` (required): Comment text to add

**Example usage:**
```
Add a comment to card 5f8b3c2a1d4e6f7g8h9i0j1k saying "Implementation completed successfully"
```

## Workflow: Implementing COPILOT Tasks

1. **Retrieve COPILOT cards:**
   ```
   Get all COPILOT cards from Today Dashboard
   ```

2. **View detailed information:**
   ```
   Show me the details of card [card_id]
   ```

3. **Implement the task:**
   - Read the card description
   - Implement the requested features/fixes
   - Test your changes

4. **Update card status:**
   ```
   Add a comment to card [card_id] saying "Task implemented: [brief description]"
   ```

## Card Organization Tips

- **Label your cards**: Add a "COPILOT" label to cards you want the AI to process
- **Use descriptive names**: Include "COPILOT" in the card name for easy filtering
- **Write clear descriptions**: Provide detailed task descriptions in the card body
- **Use checklists**: Break down complex tasks into subtasks
- **Today Dashboard**: Keep cards you want to work on today in this list

## Troubleshooting

### Server not connecting
- Verify your API key and token are correct
- Check that the board ID is valid
- Ensure the server is built: `npm run build`
- Restart VS Code

### No cards found
- Verify cards have "COPILOT" label or "COPILOT" in the name
- Check that the list name matches (default: "Today Dashboard")
- Ensure you're looking at the correct board

### Build errors
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (requires Node 18+)
- Delete `node_modules` and `dist` folders, then reinstall

## Development

### Watch mode
```powershell
npm run dev
```

### Rebuild
```powershell
npm run build
```

## License

MIT
