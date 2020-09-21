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

// this patcher doesn't do anything useful, it's just a heavily commented
// example of how to create a UPF patcher.
registerPatcher({
    info: info,
    // array of the game modes your patcher works with
    // see docs://Development/APIs/xelib/Setup for a list of game modes
    gameModes: [xelib.gmSSE, xelib.gmTES5],
    settings: {
        // The label is what gets displayed as the settings tab's label
        //label: 'Example Patcher',
        label: 'Weightless Items',
        // if you set hide to true the settings tab will not be displayed
        hide: true,
        templateUrl: `${patcherUrl}/partials/settings.html`,
        // controller function for your patcher's settings tab.
        // this is where you put any extra data binding/functions that you
        // need to access through angular on the settings tab.
        //controller: function($scope) {
        //    let patcherSettings = $scope.settings.matorsExamplePatcher;

        //    // function defined on the scope, gets called when the user
            // clicks the Show Message button via ng-click="showMessage()"
         //   $scope.showMessage = function() {
         //       alert(patcherSettings.exampleSetting);
         //   };
        //},
        // default settings for your patcher.  use the patchFileName setting if
        // you want to use a unique patch file for your patcher instead of the
        // default zPatch.esp plugin file.  (using zPatch.esp is recommended)
        defaultSettings: {
            //exampleSetting: 'hello world',
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
         /*{
            // loads all REFRs that place Weapons
            records: filesToPatch => {
                let records = filesToPatch.map(f => {
                    return xelib.GetREFRs(f, 'WEAP');
                });
                return Array.prototype.concat.apply([], records);
            },
            // patches REFRs that place weapons to be initially disabled
            patch: function(record) {
                xelib.SetFlag(record, 'Record Header\\Record Flags', 'Initially Disabled', true);
            }
        } */
    ]
    })
});