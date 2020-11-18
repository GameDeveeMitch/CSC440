using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Student_Alarm_Clock.Model
{
    public class UserUpdate
    {
        public string userID { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string redAlarmDateTime { get; set; }
        public string yellowAlarmDateTime { get; set; }
        public string redAlarmCount { get; set; }
        public string yellowAlarmCount { get; set; }
        public string isAsleep { get; set; }
    }
}