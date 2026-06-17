"""add internal_port and container_name to projects

Revision ID: 002
Revises: 001
Create Date: 2026-06-09

"""
from alembic import op
import sqlalchemy as sa

revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('projects', sa.Column('internal_port', sa.String(), nullable=True))
    op.add_column('projects', sa.Column('container_name', sa.String(), nullable=True))
    op.create_unique_constraint('uq_projects_container_name', 'projects', ['container_name'])
    op.create_index('ix_projects_container_name', 'projects', ['container_name'])


def downgrade() -> None:
    op.drop_index('ix_projects_container_name', table_name='projects')
    op.drop_constraint('uq_projects_container_name', 'projects', type_='unique')
    op.drop_column('projects', 'container_name')
    op.drop_column('projects', 'internal_port')
