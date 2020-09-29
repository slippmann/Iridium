// Server script to handle block breaking

const mySystem = server.registerSystem(0, 0);

const breakableBlocks = {
    "iridium:iridium_shovel": [
        "minecraft:grass",
        "minecraft:dirt",
        "minecraft:sand",
        "minecraft:gravel",
        "minecraft:soul_sand",
        "minecraft:soul_soil"
    ],
    "iridium:iridium_pickaxe": [
        "minecraft:stone",
        "minecraft:sandstone",
        "minecraft:cobblestone",
        "minecraft:obsidian",
        "minecraft:coal_ore",
        "minecraft:iron_ore",
        "minecraft:gold_ore",
        "minecraft:redstone_ore",
        "minecraft:lapis_ore",
        "minecraft:diamond_ore",
        "minecraft:emerald_ore",
        "minecraft:glass",
        "iridium:iridium_ore"
    ],
    "iridium:iridium_axe": [
        "minecraft:log",
        "minecraft:log2",
        "minecraft:planks",
        "minecraft:crimson_planks",
        "minecraft:warped_planks",
        "minecraft:crimson_stem",
        "minecraft:warped_stem"
    ],
    "iridium:iridium_hoe": [
        "minecraft:leaves",
        "minecraft:leaves2",
        "minecraft:sponge",
        "minecraft:nether_wart_block",
        "minecraft:warped_wart_block",
        "minecraft:shroomlight"
    ],
    "iridium:iridium_sword": [
        "minecraft:wool",
        "minecraft:web",
        "minecraft:bamboo"
    ]
};


mySystem.initialize = function() {
    this.listenForEvent("minecraft:block_destruction_started", (eventData) => this.handleBlockBreaking(eventData));
};

mySystem.handleBlockBreaking = function(eventData) {
    // Ensure event data exists
    if (eventData == null || eventData.data == null)
        return;

    let player = eventData.data.player;
    let blockPosition = eventData.data.block_position;

    // Ensure specific event data exists
    if (player == null || blockPosition == null)
        return;

    // Get the item from the players main hand (index 0)
    let mainHandItem = this.getComponent(player, "minecraft:hand_container").data[0].item;

    if (mainHandItem != null && mainHandItem.startsWith("iridium:")) {
        // Get the block name using the event position and player ticking area
        let tickingArea = this.getComponent(player, "minecraft:tick_world").data.ticking_area;
        let blockName = this.getBlock(tickingArea, blockPosition).__identifier__;

        // Check if the player's tool can break the targeted block
        if (breakableBlocks[mainHandItem] != null &&
            breakableBlocks[mainHandItem].includes(blockName)) {
            // Break the targeted block and drop the default item(s)
            this.destroyBlock(blockPosition.x,
                blockPosition.y,
                blockPosition.z);
        }
    }
};

mySystem.destroyBlock = function(x, y, z) {
    let command = `/setblock ${x} ${y} ${z} air 0 destroy`;
    this.executeCommand(command, null);
};
