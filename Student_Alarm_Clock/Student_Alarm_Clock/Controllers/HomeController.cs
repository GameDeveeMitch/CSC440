using Student_Alarm_Clock.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Student_Alarm_Clock.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            DateTime time = DateTime.Now;
            try
            {
                return View();
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

            return View();
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
                    alarmList.alarmDateTime = time;
                    alarmList.alarmID = Int32.Parse(list.alarmID);
                    alarmList.alarmName = list.alarmName;
                    alarmList.alarmDays = list.alarmDays;
                    alarmList.isEnabled = bool.Parse(list.isEnabled);
                    alarmList.userID = Int32.Parse(list.userId);
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

        [HttpPost]
        [ActionName("updateAlarm")]
        public ActionResult UpdateAlarmList(AlarmInput list)
        {
            DateTime time = DateTime.Parse(list.alarmDateTime);
            try
            {
                using (var db = new AlarmsEntities())
                {
                    var alarmList = new alarm_list();
                    alarmList.alarmDateTime = time;
                    alarmList.alarmID = Int32.Parse(list.alarmID);
                    alarmList.alarmName = list.alarmName;
                    alarmList.alarmDays = list.alarmDays;
                    alarmList.isEnabled = bool.Parse(list.isEnabled);
                    alarmList.userID = int.Parse(list.userId);

                    db.alarm_list.AddOrUpdate(alarmList);
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
        [HttpGet]
        [ActionName("readAlarms")]
        public ActionResult ReturnAlarms()
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            List<alarm_list> alarms = new List<alarm_list>();

            using (var db = new AlarmsEntities())
            {
                var query = from th in db.alarm_list
                            select th;
                alarms = query.ToList();
            }
            return Content(jss.Serialize(alarms));
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
        public ActionResult Account()
        {
            ViewBag.Message = "Account Information";

            return View();
        }

        public ActionResult AccountLogin()
        {
            ViewBag.Message = "Account Sign In";

            return View();
        }

        public ActionResult AccountSignUp()
        {
            ViewBag.Message = "Account Sign Up";

            return View();
        }

        [HttpPost]
        [ActionName("addUser")]
        public ActionResult AddUser(UserInput user)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            DateTime redTime = DateTime.Parse(user.redAlarmDateTime);
            DateTime yellowTime = DateTime.Parse(user.yellowAlarmDateTime);
            try
            {
                var result = new user();
                using (var db = new AlarmsEntities())
                {
                    var newUser = new user();
                    newUser.firstName = user.firstName;
                    newUser.lastName = user.lastName;
                    newUser.username = user.username;
                    newUser.userPassword = user.password;
                    newUser.redAlarmDateTime = redTime;
                    newUser.yellowAlarmDateTime = yellowTime;
                    newUser.redAlarmCount = int.Parse(user.redAlarmCount);
                    newUser.yellowAlarmCount = int.Parse(user.yellowAlarmCount);
                    newUser.isAsleep = bool.Parse(user.isAsleep);

                    result = db.users.Add(newUser);
                    db.SaveChanges();
                }
                return Content(jss.Serialize(result));
            }
            catch (DbUpdateException e)
            {
                Debug.WriteLine(e);
                return Content(null);
            }
        }
        [HttpPost]
        [ActionName("updateUser")]
        public ActionResult UpdateUser(UserUpdate user)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            DateTime redTime = DateTime.Parse(user.redAlarmDateTime);
            DateTime yellowTime = DateTime.Parse(user.yellowAlarmDateTime);
            try
            {
                var numEntries = 0;
                using (var db = new AlarmsEntities())
                {
                    var userId = int.Parse(user.userID);
                    var query = from th in db.users.Where(t => t.userID == userId)
                                select th;
                    var newUser = new user();
                    newUser = query.FirstOrDefault();
                    newUser.redAlarmDateTime = redTime;
                    newUser.yellowAlarmDateTime = yellowTime;
                    newUser.redAlarmCount = int.Parse(user.redAlarmCount);
                    newUser.yellowAlarmCount = int.Parse(user.yellowAlarmCount);
                    newUser.isAsleep = bool.Parse(user.isAsleep);

                    db.users.AddOrUpdate(newUser);
                    numEntries = db.SaveChanges();
                }
                return Content(jss.Serialize(numEntries));
            }
            catch (DbUpdateException e)
            {
                Debug.WriteLine(e);
                return Content(null);
            }
        }

        [HttpPost]
        [ActionName("loginUser")]
        public ActionResult userLogin(UserLogin user)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            user queryUser = new user();

            using (var db = new AlarmsEntities())
            {
                queryUser.username = user.username;
                queryUser.userPassword = user.userPass;
                var query = from th in db.users.Where(t => ((t.username == queryUser.username) && (t.userPassword == queryUser.userPassword)))
                            select th;
                queryUser = query.FirstOrDefault();
                if (queryUser != null && queryUser.userPassword == user.userPass && queryUser.username == user.username) {
                    queryUser.userPassword = "";
                }
                else
                {
                    queryUser = null;
                }
            }
            return Content(jss.Serialize(queryUser));
        }
        [HttpPost]
        [ActionName("deleteAlarm")]
        public ActionResult deleteAlarm(alarm_list alarm)
        {

            using (var db = new AlarmsEntities())
            {
                bool oldValidateOnSaveEnabled = db.Configuration.ValidateOnSaveEnabled;
                try
                {
                    db.Configuration.ValidateOnSaveEnabled = false;

                    db.alarm_list.Attach(alarm);
                    db.Entry(alarm).State = EntityState.Deleted;
                    //db.alarm_list.Remove(alarm);
                    db.SaveChanges();
                }
                finally
                {
                    db.Configuration.ValidateOnSaveEnabled = oldValidateOnSaveEnabled;
                }
            }
            return View("Index");
        }
    }
}