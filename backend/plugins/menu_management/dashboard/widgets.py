class MenuStatsWidget:
    def to_dict(self):
        return {
            "type": "stats",
            "title": "Total Menu Items",
            "value": 42,  # Mock value
            "icon": "utensils"
        }
