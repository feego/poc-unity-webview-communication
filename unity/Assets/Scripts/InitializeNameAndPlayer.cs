using UnityEngine;
using UnityEngine.UI;

public class InitializeNameAndPlayer : MonoBehaviour
{
    public Text nameField;
    public Text playerField;

    void Start()
    {
        Update();
    }

    public void Update()
    {
        if (PlayerPrefs.HasKey("name") && PlayerPrefs.HasKey("player"))
        {
            nameField.text = "Name: " + PlayerPrefs.GetString("name");
            playerField.text = "Player: " + PlayerPrefs.GetString("player");
        }
    }
}
