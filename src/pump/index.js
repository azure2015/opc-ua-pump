const opcua = require('node-opcua');
const status = require('./status');

function getStatus(setpoint, rpm) {
  const error = Math.abs(setpoint - rpm);

  if (error > 2) {
    return status.LimitAlarm;
  }

  return status.OK;
}

function update(pump) {
  const setpoint = 35;
  const rpm = 35 + Math.floor(Math.random() * 5);

  //console.log(pump.setpoint);

  // Set data values
  pump.setpoint.setValueFromSource({
    dataType: opcua.DataType.Int16,
    value: 35,
  });

  pump.rpm.setValueFromSource({
    dataType: opcua.DataType.Int16,
    value: rpm,
  });

  const ret = getStatus(setpoint, rpm);
  pump.status.setValueFromSource({
    dataType: opcua.DataType.UInt32,
    value: ret,
  });
}

module.exports = {
  add(addressSpace, name) {
    const index = addressSpace.getNamespaceIndex('http://yourorganisation.org/Pump/');
    const ns = addressSpace.getNamespace(index);

    // Create the pump and set any nonmutable vars
    const pumpType = ns.findObjectType('PumpType');
    const pump = pumpType.instantiate({
      browseName: name,
      organizedBy: 'ObjectsFolder',
    });
    pump.name.setValueFromSource({
      dataType: opcua.DataType.String,
      value: name,
    });
    setInterval(update, 2000, pump);
  },
};
