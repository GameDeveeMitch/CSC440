using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Student_Alarm_Clock.Model
{
    public partial class AlarmInput
    {
        public string alarmID { get; set; }
        public string alarmDateTime { get; set; }
        public string isEnabled { get; set; }
        public string alarmName { get; set; }
        public string alarmDays { get; set; }
        public string userId { get; set; }
    }
}