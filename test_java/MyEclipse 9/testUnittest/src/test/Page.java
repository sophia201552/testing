package test;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class Page {
	//构造函数初始化
	public WebDriver driver;
	
	public void teardown(){
		driver.quit();
	}
	public WebDriver chrome(String url){
		System.setProperty("webdriver.chrome.driver","D:/selenium-2.44.0/chromedriver.exe");  
		driver=new ChromeDriver();
		driver.get(url);
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		return driver;
	}
	public WebElement findElement(WebDriver driver,By ele){
		return driver.findElement((By) ele); 
	}
}
