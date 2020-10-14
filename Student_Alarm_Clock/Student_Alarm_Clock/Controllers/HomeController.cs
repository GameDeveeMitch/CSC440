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
            return View();
        }
        [HttpPost]
        [ActionName("addAlarm")]
        public ActionResult AddAlarmList(AlarmInput list)
        {
            DateTime time = DateTime.Parse(list.alarmDateTime);
            Console.WriteLine("Yeet " + list.alarmDateTime);
            try
            {
                using (var db = new AlarmsEntities())
                {
                    TimeSpan today = new TimeSpan();
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