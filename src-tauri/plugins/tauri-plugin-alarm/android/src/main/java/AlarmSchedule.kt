package com.ray.task_to.plugin.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import java.time.OffsetDateTime

class AlarmSchedule(private val args: AlarmScheduleArgs) {
    fun schedule(alarmManager: AlarmManager, context: Context) {
        val triggerAtMillis = OffsetDateTime.parse(args.triggerAt)
            .toInstant()
            .toEpochMilli()
        Log.d("AlarmSchedule", "scheduling alarm ${args.notificationId} at ${args.triggerAt} (${triggerAtMillis}ms)")

        val intent = Intent(context, AlarmReceiver::class.java).apply {
            data = Uri.parse("alarm://${args.notificationId}")
            putExtra("notificationId", args.notificationId)
            putExtra("message", args.message)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            args.notificationId.hashCode(),
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        alarmManager.setExactAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            triggerAtMillis,
            pendingIntent
        )
        Log.d("AlarmSchedule", "alarm ${args.notificationId} scheduled")
    }
}
