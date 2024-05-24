import { Optional } from "@angular/core"

export interface PlayerData {
    player_nickname: string
    player_id: string | null
    session_start_at?: Date | null
    session_end_at?: Date | null
    buy_in?: number | null
    stack: number
    net: number
}