#!/usr/bin/env python3
"""basic flask app
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
from typing import Union, Dict

app = Flask(__name__)
babel = Babel(app)


class Config:
    """
    config class with default and lang attr
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}
app.config.from_object(Config)
app.url_map.strict_slashes = False


def get_user() -> Union[Dict, None]:
    """
    retrieves user by id
    """
    login_id = request.args.get('login_as')
    if login_id:
        return users.get(int(login_id))
    return None


@app.before_request
def before_request() -> None:
    """
    perfoms routines before each requests resolution
    """
    user = get_user()
    g.user = user


@babel.localeselector
def get_locale():
    """
    babel locale selector decorator
    determine the best match with our supported languages.
    """
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale
    if g.user:
        loc = g.user.get('locale')
        if loc and loc in app.config['LANGUAGES']:
            return loc
    loc = request.headers.get('Locale', None)
    if loc in app.config['LANGUAGES']:
        return loc
    return request.accept_languages.best_match(app.config['LANGUAGES'])
# babel.init_app(app, locale_selector=get_locale)


@app.route('/')
def get_index():
    """Returns index html"""
    return render_template('6-index.html')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
