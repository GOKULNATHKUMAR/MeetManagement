# Telegram Bot Setup Guide

## Overview
This guide explains how to set up **free Telegram notifications** for your Chicken Shop Management System. Unlike paid services like Twilio WhatsApp, Telegram Bot API is completely free with no usage limits.

## Prerequisites
- Telegram account (download from App Store/Google Play)
- Internet connection

## Step 1: Create Your Telegram Bot

### 1.1 Start BotFather
1. Open Telegram
2. Search for **@BotFather**
3. Send `/start` to begin

### 1.2 Create New Bot
1. Send `/newbot` to BotFather
2. Choose a bot name (e.g., "Chicken Shop Reports")
3. Choose a username (must end with "bot", e.g., "ChickenShopReportsBot")
4. **Save the API token** - you'll need this!

### 1.3 Configure Bot (Optional)
You can customize your bot with:
- `/setdescription` - Add description
- `/setuserpic` - Add profile picture
- `/setcommands` - Add command list

## Step 2: Get Your Chat ID

### 2.1 Start Chat with Your Bot
1. Find your bot in Telegram (search for the username you created)
2. Send any message to activate the bot (e.g., "Hello")

### 2.2 Get Chat ID Automatically
Run this command in your backend directory:
```bash
cd backend
python -c "
import requests
from decouple import config
token = config('TELEGRAM_BOT_TOKEN')
url = f'https://api.telegram.org/bot{token}/getUpdates'
response = requests.get(url)
data = response.json()
if data.get('ok') and data.get('result'):
    for update in data['result']:
        if 'message' in update:
            print(f'Your TELEGRAM_CHAT_ID: {update[\"message\"][\"chat\"][\"id\"]}')
            break
"
```

### 2.3 Manual Method (Alternative)
Visit this URL in your browser:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```
Look for `"chat":{"id":123456789}` in the JSON response.

## Step 3: Configure Environment Variables

### 3.1 Update .env File
Edit `backend/.env`:
```env
# Telegram Bot Configuration (Free alternative to WhatsApp)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789
TELEGRAM_CHAT_ID=123456789
```

### 3.2 Restart Backend
```bash
# Stop current backend (Ctrl+C)
# Restart
cd backend && python -m uvicorn app.main:app --reload
```

## Step 4: Test Notifications

### 4.1 Test from Command Line
```bash
cd backend
python -c "
import requests
from decouple import config
token = config('TELEGRAM_BOT_TOKEN')
chat_id = config('TELEGRAM_CHAT_ID')
url = f'https://api.telegram.org/bot{token}/sendMessage'
payload = {
    'chat_id': chat_id,
    'text': '🐔 *Test from Chicken Shop System*\n\n✅ Telegram notifications working!',
    'parse_mode': 'Markdown'
}
response = requests.post(url, json=payload)
print('✅ Success!' if response.status_code == 200 else f'❌ Error: {response.text}')
"
```

### 4.2 Test from Web Interface
1. Login to your application
2. Go to Reports → Daily Reports
3. Select a date and generate report
4. Click "Send via Telegram"
5. Check your Telegram for the notification!

## Message Format

Your daily reports will look like this:

```
📊 Daily Report - 2026-04-15

💰 Total Intake: ₹5000.00
💵 Total Sales: ₹7500.00
💸 Total Expenses: ₹1200.00
📈 Profit/Loss: ₹1300.00

Generated for Your Name
```

## Troubleshooting

### Bot Not Responding
- Make sure you sent a message to activate the bot
- Check that TELEGRAM_BOT_TOKEN is correct
- Verify bot is not blocked

### Wrong Chat ID
- Send another message to the bot
- Re-run the chat ID detection script
- Make sure you're using the correct chat ID

### Permission Denied
- Check that your bot token is valid
- Ensure the bot has permission to send messages
- Verify chat ID belongs to you

### API Errors
- Check your internet connection
- Verify Telegram API is accessible
- Look at backend logs for detailed error messages

## Cost Comparison

| Service | Cost | Features |
|---------|------|----------|
| **Telegram Bot** | **$0.00 FREE** | Unlimited messages, rich formatting, reliable |
| Twilio WhatsApp | ~$0.005/message | Paid, complex setup, rate limits |
| SMS | ~$0.02/message | Basic text only |

## Advanced Features

### Rich Formatting
Telegram supports Markdown:
- `*bold text*`
- `_italic text_`
- ``` `code` ```
- Emojis: 🐔 📊 💰

### Multiple Recipients
You can send to multiple chat IDs by:
1. Adding multiple TELEGRAM_CHAT_ID entries
2. Modifying the backend to loop through recipients

### Scheduled Reports
Add cron jobs to send automatic daily reports:
```bash
# Example cron job (daily at 6 PM)
0 18 * * * curl -X POST http://localhost:8000/api/reports/daily/telegram/$(date +\%Y-\%m-\%d) -H "Authorization: Bearer YOUR_TOKEN"
```

## Security Notes
- Keep your bot token secure (never commit to git)
- Only share chat ID with authorized users
- Use HTTPS in production
- Regularly rotate tokens if compromised

## Support
If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Test with the command-line examples
4. Check backend logs for error details

**Enjoy free, unlimited notifications!** 🐔✨