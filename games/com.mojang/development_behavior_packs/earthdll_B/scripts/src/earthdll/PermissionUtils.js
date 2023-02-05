export function is_admin(player) {
    return player.hasTag("op," + player.name);
}
