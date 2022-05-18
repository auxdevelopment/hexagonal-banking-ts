create extension "uuid-ossp";


create table account (
    id uuid primary key,
    held_by uuid not null,
    balance decimal(10, 2) not null default 0.00,
    overdraft_limit decimal(10, 2) not null default 0.00,
    account_status varchar(32) not null check (account_status in ('CLOSED', 'OPEN'))
);
