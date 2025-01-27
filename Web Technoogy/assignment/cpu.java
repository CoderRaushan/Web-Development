class Main {
    public static void main(String[] args) {
        chainned obj = new chainned("Anmol");
        chainned demo = new chainned("Anmol2", 35);
    }
}
class chain {
    chain(String name) {
        System.out.println("Name: " + name);
    }
    chain(String name, int age) {
        this(name);
        System.out.println("Age: " + age);
    }
}
class chainned extends chain {
    chainned(String name) {
        super(name);
    }
    chainned(String name, int age) {
        super(name, age);
    }
}
