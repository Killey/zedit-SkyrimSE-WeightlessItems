/* global ngapp, xelib, registerPatcher, patcherUrl */

const topLevelWeightPath = 'DATA - Weight';
const nestedWeightPath = 'DATA - \\Weight';
const nestedDataDataWeightPath = 'DATA - Data\\Weight';

const setTopLevelWeight = function(record) {
    xelib.SetFloatValue(record, topLevelWeightPath, 0);
};
const setNestedWeight = function(record) {
    xelib.SetFloatValue(record, nestedWeightPath, 0);
};
const setNestedDataDataWeight = function(record) {
    xelib.SetFloatValue(record, nestedDataDataWeightPath, 0);
}
const checkWhichWeightExists = function(record) {
    if (xelib.HasElement(record, topLevelWeightPath)) {
        setTopLevelWeight(record);
    } else if (xelib.HasElement(record, nestedWeightPath)) {
        setNestedWeight(record);
    } else if (xelib.HasElement(record, nestedDataDataWeightPath)) {
        setNestedDataDataWeight(record);
    }
};

const filterForNonZeroWeight = function(record) {
    return (xelib.HasElement(record, topLevelWeightPath) && parseFloat(xelib.GetValue(record, topLevelWeightPath)) != 0)
        || (xelib.HasElement(record, nestedWeightPath) && parseFloat(xelib.GetValue(record, nestedWeightPath)) != 0)
        || (xelib.HasElement(record, nestedDataDataWeightPath) && parseFloat(xelib.GetValue(record, nestedDataDataWeightPath)) != 0);
}

registerPatcher({
    info: info,
    gameModes: [xelib.gmSSE, xelib.gmTES5],
    settings: {
        label: 'Weightless Items',
        hide: true,
        defaultSettings: {
            patchFileName: 'weightlessItems.esp'
        }
    },
    execute: (patchFile, helpers, settings, locals) => ({
        initialize: function() {
            // Optional function, omit if empty.
            // Perform anything that needs to be done once at the beginning of the
            // patcher's execution here.  This can be used to cache records which don't
            // need to be patched, but need to be referred to later on.  Store values
            // on the locals variable to refer to them later in the patching process.
            debugger;
            helpers.logMessage(settings.patchFileName);
            // this line shows you how to load records using the loadRecords helper
            // function and store them on locals for the purpose of caching
            //locals.weapons = helpers.loadRecords('WEAP');
        },
        // required: array of process blocks. each process block should have both
        // a load and a patch function.
        process: [{
            load: {
                signature: 'INGR',
                filter: filterForNonZeroWeight           
            },
            patch: function(record) {
                helpers.logMessage(`Patching ${xelib.LongName(record)}`);
                checkWhichWeightExists(record);
            }            
        }, 
        {
            load: {
                signature: 'ALCH',
                filter: filterForNonZeroWeight     
            },
            patch: function(record) {
                helpers.logMessage(`Patching ${xelib.LongName(record)}`);
                checkWhichWeightExists(record);
            }            
        }, 
        {
            load: {
                signature: 'MISC',
                filter: filterForNonZeroWeight    
            },
            patch: function(record) {
                helpers.logMessage(`Patching ${xelib.LongName(record)}`);
                checkWhichWeightExists(record);
            }
        }
    ]
    })
});