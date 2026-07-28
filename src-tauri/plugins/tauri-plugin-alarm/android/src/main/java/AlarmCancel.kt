package com.ray.task_to.plugin.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log

class AlarmCancel(private val args: AlarmCancelArgs) {
    fun cancel(alarmManager: AlarmManager, context: Context) {
        Log.d("AlarmCancel", "cancelling alarm ${args.notificationId}")
        val intent = Intent(context, AlarmReceiver::class.java).apply {
            data = Uri.parse("alarm://${args.notificationId}")
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            args.notificationId.hashCode(),
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        alarmManager.cancel(pendingIntent)
        Log.d("AlarmCancel", "alarm ${args.notificationId} cancelled")
    }
}
