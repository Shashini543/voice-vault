import boto3

from app.config import AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, SES_SENDER_EMAIL

_ses_client = boto3.client(
    "ses",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    text_body = (
        "We received a request to reset your Voice Vault password.\n\n"
        f"Reset your password: {reset_link}\n\n"
        "This link expires in 30 minutes. If you didn't request this, you can safely ignore this email."
    )
    html_body = (
        "<p>We received a request to reset your Voice Vault password.</p>"
        f'<p><a href="{reset_link}">Reset your password</a></p>'
        "<p>This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.</p>"
    )

    _ses_client.send_email(
        Source=SES_SENDER_EMAIL,
        Destination={"ToAddresses": [to_email]},
        Message={
            "Subject": {"Data": "Reset your Voice Vault password"},
            "Body": {
                "Text": {"Data": text_body},
                "Html": {"Data": html_body},
            },
        },
    )
