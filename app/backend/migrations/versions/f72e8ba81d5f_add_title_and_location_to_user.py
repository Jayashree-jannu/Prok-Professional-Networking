"""Add title and location to user

Revision ID: f72e8ba81d5f
Revises: 81ac7f925847
Create Date: 2025-07-04 16:43:00.136373

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f72e8ba81d5f'
down_revision = '81ac7f925847'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('title', sa.String(length=128), nullable=True))
        batch_op.add_column(sa.Column('location', sa.String(length=128), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('location')
        batch_op.drop_column('title')

    # ### end Alembic commands ###
