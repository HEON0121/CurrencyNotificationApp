from pywebpush import webpush, WebPushException
import json
from flask import current_app


def trigger_push_notification(push_subscription_json, title, body):
    try:
        response = webpush(
            subscription_info=json.loads(push_subscription_json),
            data=json.dumps({"title": title, "body": body}),
            vapid_private_key=current_app.config["VAPID_PRIVATE_KEY"],
            vapid_claims={
                "sub": "mailto:{}".format(
                    current_app.config["VAPID_CLAIM_EMAIL"])
            }
        )
        return response.ok
    except WebPushException as ex:
        if ex.response and ex.response.json():
            extra = ex.response.json()
            print("Remote service replied with a {}:{}, {}",
                  extra.code,
                  extra.errno,
                  extra.message
                  )
        return False


def trigger_push_notifications_for_subscriptions(subscriptions, title, body):
    return [trigger_push_notification(subscription, title, body)
            for subscription in subscriptions]
