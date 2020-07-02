from django.db import models
from django.utils.timezone import now


class BaseModel(models.Model):
    create_time = models.DateTimeField(default=now, blank=True, verbose_name="创建时间")
    update_time = models.DateTimeField(null=True,auto_now=True, verbose_name="更新时间")
    is_delete = models.BooleanField(default=False, verbose_name="逻辑删除")

    class Meta:
        abstract = True
