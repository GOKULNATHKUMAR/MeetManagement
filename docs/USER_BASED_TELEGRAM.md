# User-Based & Super Admin-Based Telegram Notifications

## Overview

This document explains the new user-based Telegram notification system. Instead of using a single global Telegram bot token and chat ID, each user can now configure their own Telegram credentials for personalized notifications. Super admins can still set system-wide defaults as a fallback.

## Architecture

### Two-Level Configuration System

```
┌─────────────────────────────────────────────────────────┐
│            Telegram Notification Flow                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  When user sends report:                                │
│  1. Check user's telegram_bot_token & telegram_chat_id  │
│  2. If empty, use system defaults from .env             │
│  3. If both empty, return error                         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Database Changes

Added two new fields to the `users` table:
```sql
ALTER TABLE users ADD COLUMN telegram_bot_token VARCHAR(NULL);
ALTER TABLE users ADD COLUMN telegram_chat_id VARCHAR(NULL);
```

## User Roles & Capabilities

### 1. Super Admin (System Administrator)
- **Can do**: Set system-wide Telegram defaults in `.env` file
- **Can do**: Override defaults by configuring personal Telegram in Profile
- **Benefits**: Acts as fallback for all users, ensures no notifications are lost
- **Configuration**: `backend/.env` file (global) or Profile → Telegram Settings (personal)

### 2. Regular Users (Shop Owners)
- **Can do**: Configure personal Telegram bot in Profile settings
- **Can do**: Override any system defaults
- **Benefits**: Own notification stream, privacy, customization
- **Configuration**: Login → Dashboard → Profile → Telegram Settings

## Implementation Details

### Backend Changes

#### 1. **Database Migration** (`backend/alembic/versions/9b269363ce70_add_telegram_fields_to_user.py`)
```python
def upgrade() -> None:
    op.add_column('users', sa.Column('telegram_bot_token', sa.String(), nullable=True))
    op.add_column('users', sa.Column('telegram_chat_id', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('users', 'telegram_chat_id')
    op.drop_column('users', 'telegram_bot_token')
```

#### 2. **Model Update** (`backend/app/models/models.py`)
```python
class User(Base):
    __tablename__ = "users"
    # ... existing fields ...
    telegram_bot_token = Column(String, nullable=True)  # User's Telegram bot token
    telegram_chat_id = Column(String, nullable=True)    # User's Telegram chat ID
```

#### 3. **Schema Update** (`backend/app/schemas/schemas.py`)
```python
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_approved: Optional[bool] = None
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
```

#### 4. **Auth Endpoints** (`backend/app/routes/auth.py`)
- **New Endpoint**: `PUT /auth/me` - Update user profile including Telegram settings
```python
@router.put("/me", response_model=UserSchema)
async def update_current_user(
    user_update: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Updates telegram_bot_token and telegram_chat_id if provided
    # ...
```

#### 5. **Reports Endpoint** (`backend/app/routes/reports.py`)
- **Updated Logic**: Uses user's settings or falls back to system defaults
```python
@router.post("/daily/telegram/{report_date}")
async def send_daily_telegram_report(
    report_date: date,
    current_user = Depends(get_current_approved_user),
    db: Session = Depends(get_db)
):
    # Use user's telegram settings, fallback to global if not set
    bot_token = current_user.telegram_bot_token or TELEGRAM_BOT_TOKEN
    chat_id = current_user.telegram_chat_id or TELEGRAM_CHAT_ID
    
    # Validate and send message...
```

### Frontend Changes

#### 1. **Profile Component** (`frontend/src/app/components/profile/`)
New standalone component for user profile management:

**profile.ts**:
- Form with full_name, email, telegram_bot_token, telegram_chat_id fields
- `updateUser()` method calls `authService.updateUser()`
- Error handling with snackbar notifications

**profile.html**:
- Material form fields for user data
- Special Telegram section with helpful hints
- Save/Cancel buttons
- Back to Dashboard button

**profile.scss**:
- Responsive layout
- Telegram section styling with blue accent
- Form spacing and alignment

#### 2. **Auth Service** (`frontend/src/app/services/auth.service.ts`)
```typescript
// New method
updateUser(userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>('/auth/me', userData).pipe(
        tap(user => this.currentUserSubject.next(user))
    );
}

// Updated User interface
export interface User {
    id: number;
    email: string;
    username: string;
    full_name: string;
    is_active: boolean;
    is_superuser: boolean;
    is_approved: boolean;
    telegram_bot_token?: string;      // NEW
    telegram_chat_id?: string;         // NEW
    created_at: string;
    updated_at?: string;
}
```

#### 3. **Dashboard Component** (`frontend/src/app/components/dashboard/`)
- Added Profile card to dashboard
- Route: `/profile`
- New `navigateToProfile()` method

#### 4. **App Routes** (`frontend/src/app/app.routes.ts`)
```typescript
{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
```

## Configuration Workflow

### For Super Admin (System-Wide Setup)

1. **Set System Defaults**:
   ```
   backend/.env
   TELEGRAM_BOT_TOKEN=your-bot-token
   TELEGRAM_CHAT_ID=your-chat-id
   ```

2. **Restart Backend**:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

3. **All users now have fallback notifications** to the super admin's Telegram

### For Individual Users (Personal Setup)

1. **Create Personal Bot**:
   - Go to Telegram, search for @BotFather
   - Create new bot using `/newbot` command
   - Save bot token
   - Get chat ID by sending message to bot

2. **Configure in Profile**:
   - Login to application
   - Go to Dashboard → Profile
   - Fill in "Telegram Bot Token" field
   - Fill in "Telegram Chat ID" field
   - Click "Update Profile"

3. **Test Notifications**:
   - Go to Reports → Daily Reports
   - Select date and generate report
   - Click "Send via Telegram"
   - Check your personal Telegram

## Priority Hierarchy

When sending a report, the system uses this priority:

```
1. User's Personal Telegram Settings (if configured)
   ↓ (if empty)
2. System Defaults from .env (if configured)
   ↓ (if empty)
3. ERROR: No Telegram configuration available
```

## Error Handling

### Case 1: User has personal settings
```
✅ Use user's telegram_bot_token & telegram_chat_id
```

### Case 2: User has no settings, system has defaults
```
✅ Use system TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID
```

### Case 3: Neither user nor system has settings
```
❌ HTTP 400: "Telegram configuration not set up. 
    Please configure your Telegram bot token and chat ID 
    in your profile settings."
```

## Database Migration

The migration file automatically handles:

1. **Adding columns** when upgrading:
   ```sql
   ALTER TABLE users ADD COLUMN telegram_bot_token VARCHAR(NULL);
   ALTER TABLE users ADD COLUMN telegram_chat_id VARCHAR(NULL);
   ```

2. **Removing columns** when downgrading:
   ```sql
   ALTER TABLE users DROP COLUMN telegram_chat_id;
   ALTER TABLE users DROP COLUMN telegram_bot_token;
   ```

## API Endpoints

### Update User Profile (New)
```
PUT /auth/me
Authorization: Bearer <token>

Request Body:
{
    "full_name": "John Doe",
    "email": "john@example.com",
    "telegram_bot_token": "1234567890:ABCdef...",
    "telegram_chat_id": "123456789"
}

Response:
{
    "id": 1,
    "email": "john@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "is_active": true,
    "is_superuser": false,
    "is_approved": true,
    "telegram_bot_token": "1234567890:ABCdef...",
    "telegram_chat_id": "123456789",
    "created_at": "2026-05-12T...",
    "updated_at": "2026-05-12T..."
}
```

### Send Daily Report via Telegram (Updated)
```
POST /api/reports/daily/telegram/2026-05-12
Authorization: Bearer <token>

Response:
{
    "message": "Daily report sent via Telegram to your configured chat"
}
```

## Use Cases

### Use Case 1: Super Admin Broadcasting
- Super admin configures system Telegram in `.env`
- New users register and approve
- Reports automatically go to super admin's Telegram
- Super admin tracks all shop activity in one place

### Use Case 2: Individual Shop Owner
- Shop owner creates personal Telegram bot
- Configures it in profile
- Receives their own reports to their personal Telegram
- No interference with other shops' notifications

### Use Case 3: Multi-Location Business
- Each location has own Telegram bot
- Each manager configures personal bot
- Reports go to respective managers
- Isolated notification streams

### Use Case 4: Team Collaboration
- Multiple users can share same bot token/chat ID
- Their reports go to shared team Telegram group
- Enables team-wide monitoring

## Security Considerations

1. **Telegram Token Storage**: Stored in plaintext in database (consider encryption for production)
2. **Profile Access**: Only accessible to logged-in users (AuthGuard protects `/profile`)
3. **Token Validation**: Invalid tokens fail at Telegram API level (no local validation)
4. **Field Optional**: Leaving fields blank is safe (falls back to system defaults)

## Future Enhancements

1. **Telegram Token Encryption**: Store tokens encrypted in database
2. **Notification Preferences**: Let users choose report types to receive
3. **Multiple Recipients**: Support multiple Telegram chat IDs per user
4. **Notification History**: Log all sent notifications
5. **Telegram Groups**: Support sending to groups/channels
6. **Scheduled Reports**: Automatic daily/weekly report sending

## Testing Checklist

- [ ] Super admin can set system defaults in `.env`
- [ ] Regular user can configure personal Telegram in Profile
- [ ] User settings override system defaults
- [ ] Reports send to user's Telegram if configured
- [ ] Reports send to system Telegram if user has no settings
- [ ] Error message appears if neither is configured
- [ ] Profile update preserves other user fields
- [ ] Backend migration creates columns successfully
- [ ] Frontend builds without errors
- [ ] Profile component displays in dashboard

## Troubleshooting

### Issue: "Telegram configuration not set up"
**Solution**: 
- Go to Profile and add your Telegram bot token and chat ID, OR
- Ask super admin to set system defaults in `.env`

### Issue: Wrong chat receives notifications
**Solution**:
- Verify your telegram_chat_id is correct
- Make sure you sent a message to your bot to activate it
- Check that bot token is valid

### Issue: Profile updates not saving
**Solution**:
- Check browser console for errors
- Verify user is logged in (has valid token)
- Check backend logs for validation errors
- Try clearing browser cache

## Files Modified

**Backend:**
- `/backend/app/models/models.py` - Added telegram fields to User model
- `/backend/app/schemas/schemas.py` - Added telegram fields to schemas
- `/backend/app/routes/auth.py` - Added PUT /auth/me endpoint
- `/backend/app/routes/reports.py` - Updated telegram report endpoint
- `/backend/alembic/versions/9b269363ce70_add_telegram_fields_to_user.py` - Database migration

**Frontend:**
- `/frontend/src/app/components/profile/profile.ts` - New profile component
- `/frontend/src/app/components/profile/profile.html` - Profile template
- `/frontend/src/app/components/profile/profile.scss` - Profile styles
- `/frontend/src/app/services/auth.service.ts` - Added updateUser method
- `/frontend/src/app/components/dashboard/dashboard.component.ts` - Added profile navigation
- `/frontend/src/app/components/dashboard/dashboard.component.html` - Added profile card
- `/frontend/src/app/app.routes.ts` - Added profile route

**Documentation:**
- `/docs/TELEGRAM_SETUP.md` - Updated with user-based setup instructions
- `/docs/USER_BASED_TELEGRAM.md` - This file

