document.addEventListener('DOMContentLoaded', function () {
  registerLicense("Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH1fdnVURWVeVEB1VkI=");

  var scheduler = new ej.schedule.Schedule({
    height: '600px',
    selectedDate: new Date(),
    eventSettings: {
      dataSource: []
    },
    workHours: {
      start: '10:00',
      end: '22:00'
    },
    actionComplete: function (args) {
      if (args.requestType === 'eventCreated') {
        handleSchedulerCreate(args.addedRecords);
      } else if (args.requestType === 'eventChanged') {
        handleSchedulerUpdate(args.changedRecords);
      } else if (args.requestType === 'eventRemoved') {
        handleSchedulerDelete(args.deletedRecords);
      }
    }
  });

  scheduler.appendTo('#Scheduler');

  var grid = new ej.grids.Grid({
    height: '400px',
    columns: [
      { field: 'Id', headerText: 'ID', textAlign: 'Center', width: 70 },
      { field: 'Subject', headerText: 'Event Name', textAlign: 'Center', width: 120 },
      { field: 'StartTime', headerText: 'Start Time', textAlign: 'Center', width: 120 },
      { field: 'EndTime', headerText: 'End Time', textAlign: 'Center', width: 120 },
      { field: 'Status', headerText: 'Status', textAlign: 'Center', width: 120 }
    ],
    dataSource: []
  });

  grid.appendTo('#Grid');

  function handleSchedulerCreate(events) {
    events.forEach(event => {
      event.Status = 'Pending';
      grid.dataSource.push(event);
      grid.refresh();
    });
  }

  function handleSchedulerUpdate(events) {
    events.forEach(event => {
      let gridData = grid.dataSource.find(data => data.Id === event.Id);
      if (gridData) {
        Object.assign(gridData, event);
        grid.refresh();
      }
    });
  }

  function handleSchedulerDelete(events) {
    events.forEach(event => {
      let index = grid.dataSource.findIndex(data => data.Id === event.Id);
      if (index !== -1) {
        grid.dataSource.splice(index, 1);
        grid.refresh();
      }
    });
  }
});
