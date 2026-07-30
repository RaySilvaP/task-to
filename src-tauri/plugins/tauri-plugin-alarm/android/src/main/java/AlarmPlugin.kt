package com.ray.task_to.plugin.alarm

import android.app.Activity
import android.app.AlarmManager
import android.content.Intent
import android.content.Context
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke

@InvokeArg
class AlarmScheduleArgs {
    lateinit var notificationId: String
    lateinit var triggerAt: String
    lateinit var message: String
    var route: String? = null
}

@InvokeArg
class AlarmCancelArgs {
   lateinit var notificationId: String
}

@TauriPlugin
class AlarmPlugin(private val activity: Activity): Plugin(activity) {
    override fun onNewIntent(intent: Intent) {
        val route = intent.getStringExtra("route")

        val event = JSObject()
        event.put("route", route)

        trigger("newIntent", event)
    }

    @Command
    fun schedule(invoke: Invoke) {
        val args = invoke.parseArgs(AlarmScheduleArgs::class.java)
        val alarmManager = activity.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        AlarmSchedule(args).schedule(alarmManager, activity)
        invoke.resolve()
    }

    @Command
    fun cancel(invoke: Invoke) {
        val args = invoke.parseArgs(AlarmCancelArgs::class.java)
        val alarmManager = activity.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        AlarmCancel(args).cancel(alarmManager, activity)
        invoke.resolve()
    }
}
