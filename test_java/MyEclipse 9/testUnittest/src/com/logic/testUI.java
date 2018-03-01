package com.logic;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class testUI {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.setProperty("webdriver.chrome.driver","D:/selenium-2.44.0/chromedriver.exe");  
		WebDriver dr=new ChromeDriver();
		dr.get("http://beop.rnbtech.com.hk");
		System.out.println("--"+dr.getPageSource());
		dr.quit();
		
	}

}
