//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Student_Alarm_Clock.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class alarm_list
    {
        public int alarmID { get; set; }
        public Nullable<System.DateTime> alarmDateTime { get; set; }
        public Nullable<bool> isEnabled { get; set; }
        public string alarmName { get; set; }
        public string alarmDays { get; set; }
    }
}
