from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BasePlugin(ABC):
    """
    Abstract base class for all plugins.
    """
    
    @abstractmethod
    def activate(self, site) -> None:
        """Logic to execute when the plugin is activated for a site."""
        pass

    @abstractmethod
    def deactivate(self, site) -> None:
        """Logic to execute when the plugin is deactivated for a site."""
        pass

    @abstractmethod
    def get_dashboard_widgets(self, user, site) -> List[Dict[str, Any]]:
        """Returns a list of widget configurations for the dashboard."""
        pass

    @abstractmethod
    def register_api_routes(self) -> List[Any]:
        """Returns list of API route configurations."""
        pass
