export interface AccountResource {
    readonly id: string,
    readonly held_by: string,
    readonly balance: number,
    readonly overdraft_limit: number,
    readonly status: 'OPEN' | 'CLOSED',
}
