package test;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends Page {

//	public LoginPage( WebDriver driver,String base_url) {
//		super(driver,base_url);
//		// TODO Auto-generated constructor stub
//	}
	public WebDriver login(String username,String password){
		WebDriver driver=chrome("http://beop.rnbtech.com.hk");
		findElement(driver, By.id("txtName")).sendKeys(username);
		findElement(driver,By.id("txtPwd")).sendKeys(password);
		findElement(driver,By.id("btnLogin")).click();
		return driver;
	}
}
