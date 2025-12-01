import os
import importlib
from typing import List

def load_plugins() -> List[object]:
    plugins = []
    base = os.path.dirname(__file__)
    for f in os.listdir(base):
        if not f.endswith(".py"):
            continue
        if f == "__init__.py":
            continue
        name = f[:-3]
        try:
            module = importlib.import_module(f"plugins.{name}")
            if hasattr(module, "Plugin"):
                try:
                    inst = module.Plugin()
                    plugins.append(inst)
                except Exception as e:
                    print(f"Plugin init failed: {name} -> {e}")
        except Exception as e:
            print(f"Plugin import failed: {name} -> {e}")
    return plugins
