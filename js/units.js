(function () {
    window.Units = [
        {
            name: 'Brute',
            damage: 5,
            hitPoints: 10,
            unlocked: true,
            requirements: [
                {resource: 'wood', val: 10}
            ],
        },
        {
            name: 'Slinger',
            damage: 8,
            hitPoints: 8,
            unlocked: true,
            requirements: [
                {resource: 'wood', val: 15}
            ],
        },
        {
            name: 'Fighter',
            damage: 15,
            hitPoints: 18,
            unlocked: false,
            needsResearch: 'Stone-Axe',
            requirements: [
                {resource: 'wood', val: 20},
                {resource: 'stone', val: 10}
            ],
        },
        {
            name: 'Archer',
            damage: 20,
            hitPoints: 15,
            unlocked: false,
            needsResearch: 'Bow',
            requirements: [
                {resource: 'wood', val: 25},
                {resource: 'stone', val: 5}
            ],
        }
    ]
}) ();