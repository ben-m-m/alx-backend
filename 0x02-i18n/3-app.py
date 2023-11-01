#!/usr/bin/env python3
"""basic flask app
"""
from flask import Flask, render_template, request
from flask_babel import Babel, _

app = Flask(__name__)
babel = Babel(app)


class Config:
    """
    config class with default and lang attr
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app.config.from_object(Config)
app.url_map.strict_slashes = False


@babel.localeselector
def get_locale():
    """
    babel locale selector decorator
    determine the best match with our supported languages.
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """Returns index html"""
    return render_template('3-index.html')


if __name__ == '__main__':
    app.run()

