# Quick Setup Guide for Trello MCP Server

## Step 1: Get Trello Credentials

### Get API Key and Token:
1. Visit: https://trello.com/app-key
2. Copy your **API Key**
3. Click the "Token" link or visit the authorization URL shown on that page
4. Authorize and copy your **Token**

### Get Board ID:
**Option 1** - From URL:
1. Open your Trello board
2. Add `.json` to the URL (e.g., https://trello.com/b/ABC123.json)
3. Find the "id" field in the JSON

**Option 2** - Use the MCP server:
1. Complete setup with just API Key and Token
2. Ask Copilot: "What Trello boards do I have?"
3. Copy the board ID from the results

## Step 2: Set Environment Variables

### Option A: Create .env file (Recommended)
1. Navigate to: `D:\Oracle\oracledev\mcp-servers\trello`
2. Copy `.env.example` to `.env`
3. Edit `.env` with your credentials:
   ```
   TRELLO_API_KEY=your_actual_api_key
   TRELLO_TOKEN=your_actual_token
   TRELLO_BOARD_ID=your_actual_board_id
   TRELLO_LIST_NAME=Today Dashboard
   ```

### Option B: Set System Environment Variables
Set these Windows environment variables:
- `TRELLO_API_KEY`
- `TRELLO_TOKEN`
- `TRELLO_BOARD_ID`
- `TRELLO_LIST_NAME` (optional, defaults to "Today Dashboard")

## Step 3: Restart VS Code
Close and reopen VS Code to load the MCP server with your configuration.

## Step 4: Test the Integration

Ask GitHub Copilot:
- "Get all COPILOT cards from my Trello board"
- "Show me my Trello boards"
- "List the cards in Today Dashboard marked as COPILOT"

## Organizing Your Trello Cards for COPILOT

1. **Add a COPILOT Label**:
   - Go to your Trello board
   - Create a label called "COPILOT"
   - Apply it to cards you want the AI to process

2. **Or Use Card Names**:
   - Include "COPILOT" in the card title
   - Example: "[COPILOT] Fix login bug"

3. **Write Clear Descriptions**:
   - Provide detailed task requirements in the card description
   - Include acceptance criteria
   - Add links to related resources

4. **Use Checklists**:
   - Break complex tasks into subtasks
   - Track progress with checklist items

## Workflow Example

1. Create a card in "Today Dashboard" list
2. Add "COPILOT" label or include "COPILOT" in title
3. Write detailed task description
4. Ask Copilot: "Get all COPILOT cards"
5. Ask Copilot: "Show me details for card [card_id]"
6. Ask Copilot to implement the task described
7. Copilot can update the card with status comments

## Troubleshooting

**MCP Server not showing up:**
- Ensure .env file is in `D:\Oracle\oracledev\mcp-servers\trello`
- Check that the build completed: `dist/index.js` should exist
- Restart VS Code

**No cards found:**
- Verify cards have "COPILOT" label or text in name
- Check board ID is correct
- Ensure list name matches (default: "Today Dashboard")

**Authorization errors:**
- Verify API key and token are correct
- Token may have expired - generate a new one
- Ensure token has read/write permissions

## Next Steps

Once configured, you can:
- Ask Copilot to retrieve your COPILOT tasks
- Have Copilot implement tasks directly from card descriptions
- Update card status automatically after implementation
- Manage your development workflow through Trello
