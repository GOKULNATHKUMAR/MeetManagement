"""add_shop_name_to_user

Revision ID: c7a5d4e2b1f3
Revises: 9b269363ce70
Create Date: 2026-05-13 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c7a5d4e2b1f3'
down_revision: Union[str, None] = '9b269363ce70'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('shop_name', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'shop_name')
