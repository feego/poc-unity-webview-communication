using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

public struct Configuration
{
    public string name;
    public string player;
}

public class ConfigurationsController : MonoBehaviour
{
    public Configuration configurations;

    void Start()
    {
        Debug.Log("Started");
        DispatchReadyEvent();
    }

    public void Initialize(string payload)
    {
        Configuration configurations = JsonUtility.FromJson<Configuration>(payload);
        Debug.Log(configurations.name);
        Debug.Log(configurations.player);
        PlayerPrefs.SetString("name", configurations.name);
        PlayerPrefs.SetString("player", configurations.player);
        PlayerPrefs.Save();
    }

    public void DispatchReadyEvent()
    {
#if UNITY_WEBGL
                ConfigurationsControllerReadyEvent();
#endif
    }

    [DllImport("__Internal")]
    private static extern void ConfigurationsControllerReadyEvent();
}
