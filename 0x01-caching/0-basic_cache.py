#!/usr/bin/env python3
"""
BasicCache class
"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    a basic caching system
    """
    def put(self, key, item):
        """
        assign to the dictionary self.cache_data the item value for the key key
        If key or item is None, this method should not do anything.
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """
        Must return the value in self.cache_data linked to key.
        If key is None or if the key doesn’t
        exist in self.cache_data, return None.
        """
        if key is None:
            return None
        return self.cache_data.get(key, None)
