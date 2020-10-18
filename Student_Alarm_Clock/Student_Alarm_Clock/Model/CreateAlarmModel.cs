using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Student_Alarm_Clock.Model
{
    public class CreateAlarmModel
    {
        [Display(Name = "Alarm Name:")]
        [Required(ErrorMessage = "A name is required!")]
        public string AlarmName { get; set; }

        [Display(Name = "Alarm Hour(s):")]
        [Range(1, 12)]
        [Required(ErrorMessage = "Plese enter hour for alarm!")]
        [DefaultValue(0)]
        public int Hours { get; set; }

        [Display(Name = "Alarm Minute(s):")]
        [Range(0, 59)]
        [Required(ErrorMessage = "Plese enter minute(s) for alarm!")]
        [DefaultValue(0)]
        public int Minutes { get; set; }

        public int Value { get; set; }
        public string Name { get; set; }
        public bool IsChecked { get; set; }

        public List<CreateAlarmModel> CheckBoxItems { get; set; }

        public List<CreateAlarmModel> DayNightItems { get; set; }
    }
}