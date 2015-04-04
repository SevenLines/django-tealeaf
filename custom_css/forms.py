from django import forms
from django_ace.widgets import AceWidget
from custom_css.models import CustomCSS


class CustomCSSForm(forms.ModelForm):
    title = forms.CharField(widget=forms.TextInput)
    css = forms.CharField(widget=AceWidget(mode='css', height='100px'))

    class Meta:
        fields = ['title', 'css', 'enabled', ]
        model = CustomCSS

