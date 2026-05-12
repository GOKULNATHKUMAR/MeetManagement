"""add_telegram_fields_to_user

Revision ID: 9b269363ce70
Revises: d108b957f889
Create Date: 2026-05-12 14:49:56.299879

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9b269363ce70'
down_revision: Union[str, None] = 'd108b957f889'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add telegram_bot_token and telegram_chat_id columns to users table
    op.add_column('users', sa.Column('telegram_bot_token', sa.String(), nullable=True))
    op.add_column('users', sa.Column('telegram_chat_id', sa.String(), nullable=True))


def downgrade() -> None:
    # Remove telegram_bot_token and telegram_chat_id columns from users table
    op.drop_column('users', 'telegram_chat_id')
    op.drop_column('users', 'telegram_bot_token')