# Configuration file for the Sphinx documentation builder.
# PhotoBank Backend Documentation

import os
import sys
sys.path.insert(0, os.path.abspath('../backend'))

# -- Project information -----------------------------------------------------
project = 'PhotoBank Backend API'
copyright = '2026, RTU MIREA'
author = 'PhotoBank Development Team'
release = '1.0.0'
version = '1.0.0'

# -- General configuration ---------------------------------------------------
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx.ext.napoleon',
    'sphinx.ext.intersphinx',
    'sphinx.ext.todo',
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']
language = 'ru'

# -- Options for autodoc extension -------------------------------------------
autodoc_member_order = 'bysource'
autodoc_typehints = 'description'

# -- Options for Napoleon extension ------------------------------------------
napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = True
napoleon_include_private_with_doc = False
napoleon_include_special_with_doc = True
napoleon_use_admonition_for_examples = False
napoleon_use_admonition_for_notes = False
napoleon_use_admonition_for_references = False
napoleon_use_ivar = False
napoleon_use_param = True
napoleon_use_rtype = True
napoleon_preprocess_types = False
napoleon_type_aliases = None
napoleon_attr_annotations = True

# -- Options for HTML output -------------------------------------------------
html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
html_title = 'PhotoBank Backend API Documentation'
html_short_title = 'PhotoBank API'
html_logo = None
html_favicon = None

# -- Options for intersphinx extension ---------------------------------------
intersphinx_mapping = {'python': ('https://docs.python.org/3', None)}

# -- Options for todo extension ----------------------------------------------
todo_include_todos = True

# -- Custom settings ---------------------------------------------------------
pygments_style = 'sphinx'
