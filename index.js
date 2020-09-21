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
        process: [
            {
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