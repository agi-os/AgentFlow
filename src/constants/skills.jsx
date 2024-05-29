/**
 * Randomizer function moving the values to avoid predictable user experience
 */
const randomInt = value => ((0.5 + Math.random()) * value) | 0

/**
 * Defines a tier within a skill.
 * @typedef {Object} SkillTier
 * @property {string} title - The title of the tier.
 * @property {number} count - The required count for this tier.
 */

/**
 * Defines a requirement for a skill.
 * @typedef {Object} SkillRequirement
 * @property {string} type - The type of requirement ('action', 'item', 'node').
 * @property {string} [actionType] - The type of action, if applicable.
 * @property {string} [nodeType] - The type of node, if applicable.
 * @property {SkillTier[]} [tiers] - An array of tiers for this requirement.
 * @property {number} [count] - The required count, if not using tiers.
 * @property {number} [minItems] - Minimum items required for each node of this type, if applicable.
 */

/**
 * Defines a skill in the skill tree.
 * @typedef {Object} Skill
 * @property {string} title - The title of the skill.
 * @property {SkillRequirement[]} requires - An array of requirements to unlock the skill.
 * @property {Object[]} unlocks - An array of items unlocked by the skill.
 * @property {number} reward - The reward for unlocking the skill.
 */

/**
 * Tier list
 */

const chestStorageTierNames = [
  [
    // Tier 1
    'Orderly Hoarder',
    'Inventory Initiate',
    'Custodian of Curios',
    'Arranger of Assets',
    'Guardian of Goods',
  ],
  [
    // Tier 2
    'Master of the Vault',
    'Logistical Luminary',
    'Curator of Coffers',
    'Champion of Chests',
    'Warden of Wares',
  ],
  [
    // Tier 3
    'Transcendent Treasurer',
    'Cosmic Custodian',
    'Archduke of Accumulation',
    'Zenith of Storage',
    'Grand Archivist of Abundance',
  ],
  [
    // Tier 4
    'Supreme Overlord of Stuff',
    'The Chest Whisperer',
    'Keeper of the Sacred Relics',
  ],
]

const sortingTierNames = [
  [
    // Tier 1
    'Categorical Apprentice',
    'Orderly Organizer',
    'Arrangement Adept',
    'Separator of Stuff',
    'Master of Miscellany',
  ],
  [
    // Tier 2
    'Lord of Logistics',
    'Sultan of Sorting',
    'Categorization Conductor',
    'Arrangement Architect',
    'Zenith of Organization',
  ],
  [
    // Tier 3
    'Transcendent Taxonomist',
    'Cosmic Classifier',
    'Archduke of Arrangement',
    'Supreme Sovereign of Sorting',
    'Quantum Organizer',
  ],
  [
    // Tier 4
    'The Entropy Defier',
    'Chaos Tamer',
    'Whisperer of Order to the Universe',
  ],
]
/**
 * Skills that can be achieved by users of the application.
 * @type {Object.<string, Skill>}
 */
export default {
  worker: {
    title: 'Worker',
    requires: [],
    unlocks: [{ type: 'node', value: 'workbench' }],
    reward: 0,
  },

  masterMaker: {
    title: 'Master Maker',
    requires: [
      {
        type: 'item',
        tiers: [
          { title: 'Master Maker', count: 5 },
          { title: 'Creation Maestro', count: 25 },
          { title: 'Visionary Artisan', count: 20 },
          { title: 'Master Maker', count: 50 },
        ],
      },
    ],
    unlocks: [
      { type: 'edge', value: 'queue' },
      { type: 'node', value: 'itemChest' },
    ],
    reward: randomInt(5),
  },

  /**
   * Stores items in chests, rewarded based on the count of items entering chests
   */
  resourceAllocationExpert: {
    requires: [
      {
        type: 'action',
        actionType: 'itemEntersChest',
        tiers: chestStorageTierNames,
      },
    ],
    unlocks: [{ type: 'node', value: 'splitter' }],
    reward: randomInt(10),
  },

  /**
   * Routes items into different chests, rewarded based on the count of chests with at least 1 item
   */
  arrangementArtisan: {
    title: 'Arrangement Artisan',
    requires: [
      {
        type: 'node',
        nodeType: 'chest',
        tiers: sortingTierNames,
      },
    ],
    unlocks: [{ type: 'node', value: 'agent' }],
    reward: randomInt(15),
  },

  solutionArchitect: {
    title: 'Solution Architect',
    requires: [
      {
        type: 'action',
        actionType: 'applyBlueprint',
        tiers: [
          { title: 'Blueprint Virtuoso', count: 100 },
          { title: 'Schematic Sorcerer', count: 500 },
          { title: 'Transcendent Architect', count: 2000 },
        ],
      },
    ],
    unlocks: [{ type: 'node', value: 'advancedAgent' }],
    reward: randomInt(20),
  },
}
