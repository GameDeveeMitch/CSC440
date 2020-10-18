using Student_Alarm_Clock.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Student_Alarm_Clock.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            //Creating object of CheckBoxList model class
            CreateAlarmModel ChkItems = new CreateAlarmModel();

            //Additng items to the list
            List<CreateAlarmModel> ChkItem = new List<CreateAlarmModel>()
            {
              new CreateAlarmModel {Value=1,Name="Monday",IsChecked=true },
              new CreateAlarmModel {Value=2,Name="Tuesday",IsChecked=false },
              new CreateAlarmModel {Value=3,Name="Wednesday",IsChecked=false },
              new CreateAlarmModel {Value=4,Name="Thursday" ,IsChecked=false},
              new CreateAlarmModel {Value=5,Name="Friday",IsChecked=false },
              new CreateAlarmModel {Value=6,Name="Saturday" ,IsChecked=false},
              new CreateAlarmModel {Value=7,Name="Sunday" ,IsChecked=false}
            };
            //assigning records to the CheckBoxItems list 
            ChkItems.CheckBoxItems = ChkItem;

            return View(ChkItems);
        }
        public ActionResult CreateAlarm()
        {
            //Creating object of CheckBoxList model class
            CreateAlarmModel ChkItems = new CreateAlarmModel();

            //Additng items to the list
            List<CreateAlarmModel> ChkItem = new List<CreateAlarmModel>()
            {
              new CreateAlarmModel {Value=1,Name="Monday",IsChecked=true },
              new CreateAlarmModel {Value=1,Name="Tuesday",IsChecked=false },
              new CreateAlarmModel {Value=1,Name="Wednesday",IsChecked=false },
              new CreateAlarmModel {Value=1,Name="Thursday" ,IsChecked=false},
              new CreateAlarmModel {Value=1,Name="Friday",IsChecked=false },
              new CreateAlarmModel {Value=1,Name="Saturday" ,IsChecked=false},
              new CreateAlarmModel {Value=1,Name="Sunday" ,IsChecked=false}
            };
            //assigning records to the CheckBoxItems list 
            ChkItems.CheckBoxItems = ChkItem;

            List<CreateAlarmModel> dayItem = new List<CreateAlarmModel>()
            {
              new CreateAlarmModel {Value = 0, Name="AM"},
              new CreateAlarmModel {Value = 1, Name="PM"}
            };
            ChkItems.DayNightItems = dayItem;

            return View(ChkItems);
        }

        [HttpPost]
        [ActionName("addAlarm")]
        public ActionResult AddAlarmList(AlarmInput list)
        {
            DateTime time = DateTime.Parse(list.alarmDateTime);
            try
            {
                using (var db = new AlarmsEntities())
                {
                    var alarmList = new alarm_list();
                    alarmList.userID = "0";
                    alarmList.wakeTime = time.TimeOfDay;
                    alarmList.yellowTime = time.TimeOfDay;
                    alarmList.redTime = time.TimeOfDay;

                    db.alarm_list.Add(alarmList);
                    db.SaveChanges();
                }
                return View("Index");
            }
            catch (DbEntityValidationException e)
            {
                // Retrieve the error messages as a list of strings.
                var errorMessages = e.EntityValidationErrors
                        .SelectMany(x => x.ValidationErrors)
                        .Select(x => x.ErrorMessage);

                // Join the list to a single string.
                var fullErrorMessage = string.Join("; ", errorMessages);

                // Combine the original exception message with the new one.
                var exceptionMessage = string.Concat(e.Message, " The validation errors are: ", fullErrorMessage);

                // Throw a new DbEntityValidationException with the improved exception message.
                throw new DbEntityValidationException(exceptionMessage, e.EntityValidationErrors);
                Console.WriteLine(e);
                Debug.WriteLine(e);
                return View("Index");
            }
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}