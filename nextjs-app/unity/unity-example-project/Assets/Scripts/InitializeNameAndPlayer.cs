using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class InitializeNameAndPlayer : MonoBehaviour
{
    private ConfigurationsController configurationsController;

    void Start()
    {
        configurationsController = GetComponent<ConfigurationsController>();
        if (PlayerPrefs.HasKey("name") && PlayerPrefs.HasKey("player")) {
            Debug.Log(PlayerPrefs.GetString("name"));
            GameObject.Find("Name").GetComponent<Text>().text = "Name: " + PlayerPrefs.GetString("name");
            GameObject.Find("Player").GetComponent<Text>().text = "Player: " + PlayerPrefs.GetString("player");
        }
    }
}
