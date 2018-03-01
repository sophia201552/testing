package com.logic;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class LogicServiceTest {

	@Before 
	public void setUp() throws Exception {
		System.out.println("@Before ");
	}

	@After
	public void tearDown() throws Exception {
		System.out.println("@After ");
	}

	@Test
	public void testAdd() {
		System.out.println("@Test");
	}


}
