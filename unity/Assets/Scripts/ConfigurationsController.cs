using UnityEngine;

namespace Configurations
{
    public struct Configuration
    {
        public string name;
        public string player;
    }

    public class ConfigurationsController : MonoBehaviour
    {
        public InitializeNameAndPlayer nameAndPlayerInitializer;

        public void Initialize(Configuration configuration)
        {
            PlayerPrefs.SetString("name", configuration.name);
            PlayerPrefs.SetString("player", configuration.player);
            PlayerPrefs.Save();
            nameAndPlayerInitializer.Update();
        }
    }
}
