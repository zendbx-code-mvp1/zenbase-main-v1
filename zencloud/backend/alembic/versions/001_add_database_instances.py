"""add database instances table

Revision ID: 001
Revises: 
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create database_instances table"""
    op.create_table(
        'database_instances',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('database_name', sa.String(), nullable=False, unique=True),
        sa.Column('database_user', sa.String(), nullable=False, unique=True),
        sa.Column('encrypted_password', sa.String(), nullable=False),
        sa.Column('host', sa.String(), nullable=False, default='localhost'),
        sa.Column('port', sa.Integer(), nullable=False, default=5432),
        sa.Column('status', sa.String(), nullable=False, default='pending'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    
    # Create indexes
    op.create_index('ix_database_instances_user_id', 'database_instances', ['user_id'])
    op.create_index('ix_database_instances_database_name', 'database_instances', ['database_name'])
    op.create_index('ix_database_instances_status', 'database_instances', ['status'])


def downgrade() -> None:
    """Drop database_instances table"""
    op.drop_index('ix_database_instances_status', table_name='database_instances')
    op.drop_index('ix_database_instances_database_name', table_name='database_instances')
    op.drop_index('ix_database_instances_user_id', table_name='database_instances')
    op.drop_table('database_instances')
