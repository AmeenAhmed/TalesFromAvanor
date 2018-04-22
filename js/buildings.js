(function () {
    window.Buildings = [
        {
            name: 'Hunter\'s Lodge',
            requirements: [
                {resource: 'workers', val: 1}
            ],
            affects: [
                {resource: 'food', val: 1},
            ],
            unlocked: true
        },
        {
            name: 'Farm',
            requirements: [
                {resource: 'workers', val: 1},
                {resource: 'wood', val: 20}
            ],
            affects: [
                {resource: 'food', val: 2}
            ],
            unlocked: true
        },
        {
            name: 'Animal Farm',
            requirements: [
                {resource: 'workers', val: 2},
                {resource: 'wood', val: 40}
            ],
            affects: [
                {resource: 'food', val: 2},
                {resource: 'leather', val: 1}
            ],
            unlocked: true
        },
        {
            name: 'Woodcutter\'s Hut',
            requirements: [
                {resource: 'workers', val: 2}
            ],
            affects: [
                {resource: 'wood', val: 10}
            ],
            unlocked: true
        },
        {
            name: 'Quarry',
            requirements: [
                {resource: 'workers', val: 2}
            ],
            affects: [
                {resource: 'stone', val: 10}
            ],
            unlocked: false,
            needsResearch: 'Stoneworking'
        }
    ];
}) ();