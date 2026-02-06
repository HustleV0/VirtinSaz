from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseTemplate(ABC):
    """
    Abstract base class for all site templates.
    """
    
    def __init__(self, site):
        self.site = site

    @abstractmethod
    def get_required_plugins(self) -> List[str]:
        """Returns a list of plugin slugs required by this template."""
        pass

    @abstractmethod
    def get_dashboard_layout(self, user) -> List[Dict[str, Any]]:
        """Returns the dashboard layout configuration for this template."""
        pass

    @abstractmethod
    def validate_settings(self, settings: Dict[str, Any]) -> bool:
        """Validates template-specific settings."""
        pass
