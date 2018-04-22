(function () {
    window.TechTree = [
        {
            name: 'Stoneworking',
            unlocks: [
                {
                    type: 'building',
                    name: 'Quarry'
                }
            ],
            requirements: '',
            daysToComplete: 3
        },
        {
            name: 'Stone-Axe',
            unlocks: [
                {
                    type: 'unit',
                    name: 'Fighter'
                }
            ],
            requirements: 'Stoneworking',
            daysToComplete: 3
        },
        {
            name: 'Bow',
            unlocks: [
                {
                    type: 'unit',
                    name: 'Archer'
                }
            ],
            requirements: 'Stoneworking',
            daysToComplete: 3
        }
    ];
}) ();